export const getStringFromQueryParam = (param: string | string[] | undefined): string => {
    if(!param){
        return "";
    }
    if (Array.isArray(param)) {
        return param[0];
    } else {
        return param;
    }
};
