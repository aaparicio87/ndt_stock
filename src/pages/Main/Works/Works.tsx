import { DeleteDialog } from '../../../components'
import { useWorks } from './hooks/useWorks'
import { Outlet } from 'react-router-dom'


const Works = () => {

    const {
        isOpenDelete,
        onCloseDelete,
        handleConfirmDelete,
    } = useWorks()

    return (
        <>

            <Outlet />
            <DeleteDialog
                isOpen={isOpenDelete}
                onCancel={onCloseDelete}
                onDelete={handleConfirmDelete}
            />
        </>
    )
}

export default Works