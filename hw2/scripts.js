function getNeededColumnKeys(columnKeys) {
    let neededColumnsKeys = [];

    for(var i = 0; i < columnKeys.length; i++) {
        let item = columnKeys[i];
        switch (item) {
            case 'continent' :
                neededColumnsKeys.push(item)
                break;
            case 'name':
                neededColumnsKeys.push(item)
                break;
            case 'gdp':
                neededColumnsKeys.push(item)
                break;
            case 'life_expectancy':
                neededColumnsKeys.push(item)
                break;
            case 'population':
                neededColumnsKeys.push(item)
                break;
            case 'year':
                neededColumnsKeys.push(item)
                break;
            default:
                break;
        }
    }

    return neededColumnsKeys;
}