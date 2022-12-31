export const getStringFromQueryParam = (param: string | string[]): string => {
    if (Array.isArray(param)) {
        return param[0];
    } else {
        return param;
    }
};
