import Select, { MenuPlacement, MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface IProps {
    options: TOptions[]
    onChange: (newValue: MultiValue<TOptions>) => void
    value: MultiValue<TOptions>
    menuPlacement?: MenuPlacement | undefined
}

export const MultiSelect = ({ options, onChange, value, menuPlacement }: IProps) => {
    return (
        <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            onChange={onChange}
            value={value}
            menuPlacement={menuPlacement}
        />
    )
}
