import Select, { MenuPlacement, MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface IProps {
    options: TOptions[]
    onChange: (newValue: MultiValue<TOptions>) => void
    value: MultiValue<TOptions>
    menuPlacement?: MenuPlacement | undefined
    isDisabled?: boolean
}



export const MultiSelect = ({ options, onChange, value, menuPlacement, isDisabled = false }: IProps) => {


    return (
        <Select
            styles={{
                multiValueLabel: (baseStyles) => ({
                    ...baseStyles,
                    whiteSpace: 'nowrap',
                    minWidth: '6vw',
                }),
            }}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
            onChange={onChange}
            value={value}
            menuPlacement={menuPlacement}
            isDisabled={isDisabled}
        />
    )
}
