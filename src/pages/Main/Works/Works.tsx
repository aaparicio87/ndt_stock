import { HeaderViewTable } from '../../../components'
import WorksTable from './components/WorksTable/WorksTable'
import { useWorks } from './hooks/useWorks'


const Works = () => {
    const {
        isLoading,
        data,
        handleDelete,
        handleEdit,
        handleViewDetails
    } = useWorks()

    return (
        <>
            <HeaderViewTable
                name="Works"
            />
            <WorksTable
                data={data}
                onDelete={handleDelete}
                onDetails={handleViewDetails}
                onEdit={handleEdit}
                loading={isLoading}
            />
        </>
    )
}

export default Works