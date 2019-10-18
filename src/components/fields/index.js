import DescriptionField from './DescriptionField';
import ArrayField from './ArrayField';
import ObjectField from './ObjectField';
import SchemaField from './SchemaField';
import TitleField from './TitleField';
import StringField from './StringField';
import NumberField from './NumberField';
import BooleanField from './BooleanField';
import MultiSchemaField from './MultiSchemaField';

export default {
    DescriptionField,
    ArrayField,
    ObjectField,
    SchemaField,
    TitleField,
    StringField,
    NumberField,
    BooleanField,
    OneOfField: MultiSchemaField,
    AnyOfField: MultiSchemaField,
};
