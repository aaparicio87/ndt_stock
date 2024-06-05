import { FC } from 'react'
import { MultiSelect, MultiSelectProps, useMultiSelect } from 'chakra-multiselect'

export const MultiSeleect: FC<
    Omit<MultiSelectProps, 'onChange' | 'value'> &
    Partial<Pick<MultiSelectProps, 'onChange' | 'value'>>
> = ({ onChange: _onChange, value: _value, options: __options, ...props }) => {
    const { value, options, onChange } = useMultiSelect({
        value: _value ?? (props.single ? '' : []),
        options: __options!,
        onChange: _onChange,
    })

    return (
        <MultiSelect
            value={value}
            options={options}
            onChange={onChange}
            {...props}
        />
    )
}