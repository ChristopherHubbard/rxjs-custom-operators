export const getProp = (data: any, path: string, defaultValue: any = undefined): any => {
    const nestedPath: string[] = path.split('.');
    if (nestedPath.length === 0) {
        return data;
    } else if (nestedPath.length === 1) {
        return data[nestedPath[0]];
    } else if (data[nestedPath[0]] === undefined || data[nestedPath[0]] === null) {
        return defaultValue;
    }

    // Remove front element
    const nextMember: string | undefined = nestedPath.shift();
    return nextMember !== undefined ? getProp(data[nextMember], nestedPath.join('.'), defaultValue) : defaultValue;
};
