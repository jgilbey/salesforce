export const applySortCodeMask = input => {
    let value = input.replace(/-/g, '');
    
    if (value.length >= 6) {
        value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
    }

    return value;
};

export const removeMask = input => input.replace(/-/g, '');

export const filterSortCodeMaskInput = input => {
    return input.replace(/[^0-9\-]*/g,'')
}