import { Box, IconButton, IconButtonProps, Tooltip } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi'

type TProps = {
    onDetails: <Type>(item: Type) => void
    onEdit: <Type>(item: Type) => void
    onDelete: <Type>(item: Type) => void
    iconDetailsProps?: Partial<IconButtonProps>
    iconEditProps?: Partial<IconButtonProps>
    iconDeleteProps?: Partial<IconButtonProps>
}

interface IToolTips {
    label: string
    icon: IconType
    action: <Type>(item: Type) => void
    iconProps: IconButtonProps
}

export const ActionsTable = ({
    onDelete,
    onDetails,
    onEdit,
    iconDeleteProps,
    iconDetailsProps,
    iconEditProps,
}: TProps

) => {

    const tooltipList: IToolTips[] = [
        { action: onDetails, icon: FiEye, label: 'Show details', iconProps: { ...iconDetailsProps, "aria-label": "Show details" } },
        { action: onEdit, icon: FiEdit, label: 'Update', iconProps: { ...iconEditProps, "aria-label": "Update" } },
        { action: onDelete, icon: FiTrash2, label: 'Delete', iconProps: { ...iconDeleteProps, "aria-label": "Delete" } }
    ]

    return (
        <Box>
            {tooltipList.map((toolTip, index) => {

                const { label, action, icon: Icon, iconProps } = toolTip

                return (
                    <Tooltip
                        key={index}
                        label={label}
                        aria-label={label}
                    >
                        <IconButton
                            icon={<Icon />}
                            onClick={action}
                            {...iconProps}
                        />
                    </Tooltip>
                )
            })}
        </Box>
    )
}