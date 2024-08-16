import {
    Box,
    IconButton,
    IconButtonProps,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Tooltip
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FiEdit, FiEye, FiTrash2, FiWatch } from 'react-icons/fi'
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../state/features/auth/authSlice.tsx";
import { CiMenuKebab } from "react-icons/ci";

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
        { action: onDelete, icon: FiTrash2, label: 'Delete', iconProps: { ...iconDeleteProps, "aria-label": "Delete" }, visible: currentUserAdminManager },
        { action: onHours ? onHours : () => { }, icon: FiWatch, label: 'Work hours', iconProps: { ...iconHoursProps, "aria-label": "Work hours" }, visible: currentUserAdminManager && visibleHours }
    ]

    return (
        <Box>

            <Tooltip

                label={'Update'}
                aria-label={"Update"}
            >
                <IconButton
                    icon={<FiEdit />}
                    onClick={onEdit}
                    aria-label='Update'
                    {...iconEditProps}
                />
            </Tooltip>
            <Menu>
                <Tooltip

                    label={'More actions'}
                    aria-label={"More Actions"}
                >
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<CiMenuKebab />}
                        variant='outline'
                        border={0}
                    />
                </Tooltip>
                <MenuList >
                    {
                        tooltipList.map((toolTip, index) => {

                            const { label, action, icon: Icon, iconProps, visible } = toolTip
                            if (!visible) {
                                return
                            }
                            return (
                                <MenuItem
                                    icon={<Icon />}
                                    key={index}
                                    onClick={action}
                                    {...iconProps}
                                >
                                    {label}
                                </MenuItem>
                            )
                        })
                    }
                </MenuList>
            </Menu>
        </Box>
    )
}
