export const asyncHandler = (fn: Function) => {
    return function asyncUtilWrap(...args: any[]) {
        const fnReturn = fn(...args);
        const next = args[args.length - 1];
        return Promise.resolve(fnReturn).catch(next);
    };
};
