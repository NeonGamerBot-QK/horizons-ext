export function watchSelector(
    selector: string,
    callback: (element: Element) => void,
    options?: { once?: boolean; parent?: Element }
): () => void {
    const parent = options?.parent ?? document.body;

    // Check already-existing elements                                                                                                                                       
    for (const el of parent.querySelectorAll(selector)) {
        callback(el);
        if (options?.once) return () => { };
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof Element)) continue;

                if (node.matches(selector)) {
                    callback(node);
                    if (options?.once) { observer.disconnect(); return; }
                }

                // Also check children of added nodes                                                                                                                              
                for (const child of node.querySelectorAll(selector)) {
                    callback(child);
                    if (options?.once) { observer.disconnect(); return; }
                }
            }
        }
    });

    observer.observe(parent, { childList: true, subtree: true });

    // Return a cleanup function
    return () => observer.disconnect();
}