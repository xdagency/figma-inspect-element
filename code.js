// Show our plugin window
figma.showUI(__html__);
// user entered string to filter what text layers are included
let g__includes = "";
let g__type = "TEXT";
// function to find all text nodes in a selection
function findTextNodes() {
    // parse the current selected node
    for (const node of figma.currentPage.selection) {
        let selection = {
            type: node.type,
            items: []
        };
        if ("children" in node) {
            // find all the text children
            const textNodes = node.findAll(n => n.type === g__type);
            // loop through them and grab the key (layer name) and the copy (characters)
            for (let i = 0; i < textNodes.length; i++) {
                // check if the name (copykey) includes the the user defined "includes"
                if (textNodes[i].name.includes(g__includes)) {
                    selection.items.push({
                        name: textNodes[i].name,
                        copy: textNodes[i].characters // throwing error here but characters does exist as these are all text nodes
                    });
                }
            }
            // if it's just a text layer it won't have children
            // so we parse this separately
        }
        else if (node.type === g__type) {
            // check if the name (copykey) includes the the user defined "includes"
            if (node.name.includes(g__includes)) {
                selection.items.push({
                    name: node.name,
                    copy: node.characters
                });
            }
        }
        return selection;
    }
}
// listen for selection changes
figma.on('selectionchange', () => {
    // post back to our UI
    figma.ui.postMessage({ "selectedNode": findTextNodes() });
});
// listen for form updates from UI
figma.ui.onmessage = message => {
    if (message.type === 'includes') {
        // update our variable to include what was sent
        g__includes = message.include;
        // post back to our UI
        figma.ui.postMessage({ "selectedNode": findTextNodes() });
    }
};
