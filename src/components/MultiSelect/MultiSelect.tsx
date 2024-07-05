import Select, { MultiValue} from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface IProps {
    options:TOptions[]
    onChange: (newValue: MultiValue<TOptions>) => void
    value: MultiValue<TOptions>
}

export const MultiSelect = ({options, onChange, value}:IProps) => {
    return (
        <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            onChange={onChange}
            value={value}
        />
    )
}
