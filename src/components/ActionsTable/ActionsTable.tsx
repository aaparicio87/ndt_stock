import { Box, IconButton, IconButtonProps, Tooltip } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FiEdit, FiEye, FiTrash2, FiWatch } from 'react-icons/fi'
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../state/features/auth/authSlice.tsx";

type TProps = {
    onDetails: <Type>(item: Type) => void
    onEdit: <Type>(item: Type) => void
    onDelete: <Type>(item: Type) => void
    onHours?: <Type>(item: Type) => void
    iconDetailsProps?: Partial<IconButtonProps>
    iconEditProps?: Partial<IconButtonProps>
    iconDeleteProps?: Partial<IconButtonProps>
    iconHoursProps?: Partial<IconButtonProps>
    visibleHours?: boolean
}

interface IToolTips {
    label: string
    icon: IconType
    action: <Type>(item: Type) => void
    iconProps: IconButtonProps
    visible: boolean
}

export const ActionsTable = ({
    onDelete,
    onDetails,
    onEdit,
    onHours,
    iconDeleteProps,
    iconDetailsProps,
    iconEditProps,
    iconHoursProps,
    visibleHours = false
}: TProps

) => {

    const user = useSelector(selectCurrentUser);

    if (!user) {
        return null
    }

    const currentUserAdminManager = user.roles.some((rol) => rol === 'ADMINISTRATOR' || rol === 'DATA_MANAGER')

    const tooltipList: IToolTips[] = [
        { action: onDetails, icon: FiEye, label: 'Show details', iconProps: { ...iconDetailsProps, "aria-label": "Show details" }, visible: true },
        { action: onEdit, icon: FiEdit, label: 'Update', iconProps: { ...iconEditProps, "aria-label": "Update" }, visible: currentUserAdminManager },
        { action: onDelete, icon: FiTrash2, label: 'Delete', iconProps: { ...iconDeleteProps, "aria-label": "Delete" }, visible: currentUserAdminManager },
        { action: onHours ? onHours : () => { }, icon: FiWatch, label: 'Work hours', iconProps: { ...iconHoursProps, "aria-label": "Work hours" }, visible: currentUserAdminManager && visibleHours }
    ]

    return (
        <Box>
            {tooltipList.map((toolTip, index) => {

                const { label, action, icon: Icon, iconProps, visible } = toolTip
                if (!visible) {
                    return
                }
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
