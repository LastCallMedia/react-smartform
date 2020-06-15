
/**
 * Makes the proper `name` attribute for input elements, given a set of parents.
 */
export function makeElementName(parts: (string|number)[]): string {
    return parts.reduce((fqn: string, part): string => {
        if(typeof part === 'number') {
            return `${fqn}[${part}]`;
        }
        if(fqn === '') {
            return part.toString()
        }
        return `${fqn}.${part}`
    }, '')
}

export function makeElementId(parts: (string|number)[]): string {
    return parts.map(p => p.toString()).join('-');
}

export function makeElementLabel(parts: (string|number)[], prefix: string): string {
    return prefix + '.' + parts.filter(p => typeof p === 'string').join('.')
}

export function resolveFieldName(currentPath: (string|number)[], relativePath: string): string {
    if(!relativePath.includes('/')) {
        return relativePath
    }
    const relParts = relativePath.split('/');
    let current = currentPath

    relParts.forEach(part => {
        switch(part) {
            case '.':
                break;
            case '..':
                current = current.slice(0, current.length - 1);
                break;
            default:
                current = current.concat(part);
        }
    })
    return makeElementName(current)
}
