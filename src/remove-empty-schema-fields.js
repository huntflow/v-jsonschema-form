import cloneDeep from 'lodash.clonedeep';
import jsonSchemaTraverse from 'json-schema-traverse';
import jsonPointer from 'json-pointer';

export function removeEmptySchemaFields(schema, data) {
    // Вот эта машинерия нужна для того, чтобы не выводить поля,
    // которые пользователь не заполнил.
    // Для этого из оригинальной схемы удаляются части, для которых нет данных.
    //
    // TODO: не уверен что это покрывает все кейсы, поэтому
    // а) нужно каждую схему проверять глазами, хотя бы минимально
    // б) собрать кейсы и написать тесты

    const emptyPointers = [];
    const tranverseFn = (...args) => {
        const [
            ,
            currentJsonPointer,
            ,
            ,
            parentKeyword,
            ,
            property
        ] = args;

        if (parentKeyword === 'properties' && property) {
            const dataPointer = jsonPointer.compile(
                jsonPointer
                    .parse(currentJsonPointer)
                    .filter(part => part !== 'properties')
            );
            const hasData = jsonPointer.has(data, dataPointer);
            if (hasData === false) {
                emptyPointers.push(currentJsonPointer);
            }

            if (hasData) {
                const data = jsonPointer.get(data, dataPointer);
                const isEmptyData =
                    // скрываем поля, значением которых является пустой массив
                    // (например если все чекбоксы выключены)
                    (Array.isArray(data) && data.length === 0) ||
                    // скрываем поля, значением которых является пустая строка
                    data === '';

                if (isEmptyData) {
                    emptyPointers.push(currentJsonPointer);
                }
            }
        }
    };
    jsonSchemaTraverse(schema, { cb: tranverseFn });
    const resultSchema = cloneDeep(schema);
    emptyPointers.forEach(pointer => {
        safeJsonPointerRemove(resultSchema, pointer);
    });
    return resultSchema;
}

function safeJsonPointerRemove(obj, pointer) {
    // очень может быть что мы удалили кусок раньше,
    // тогда будет экспешон при попытке удалить ещё раз
    try {
        jsonPointer.remove(obj, pointer);
    } catch {
        //
    }
}
