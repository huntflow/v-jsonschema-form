<template>
    <div className="panel panel-danger errors">
        <div className="panel-heading">
            <h3 className="panel-title">
                Errors
            </h3>
        </div>
        <ul className="list-group">
            <li
                v-for="(error, index) in errors"
                :key="index"
                className="list-group-item text-danger"
            >
                {{ error.stack }}
            </li>
        </ul>
    </div>
</template>


<script>
    const PROPS = {
        errors: {
            type: Array,
            default: [],
        },
    };

    export default {
        inheritAttrs: false,
        props: PROPS,
    };
</script>
