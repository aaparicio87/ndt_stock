import { Button } from '@chakra-ui/react'
import { HeaderViewTable } from '../../../../../components'
import { FiPlus } from "react-icons/fi"
import { useStockContext } from '../../../../../context/StockContext'


type TProps = {
    isAdminManager: boolean
}

const HeaderTable = ({ isAdminManager }: TProps) => {

    const { onOpen } = useStockContext()

    return (
        <HeaderViewTable
            name="Stock"
        >
            {isAdminManager && <Button
                leftIcon={<FiPlus />}
                colorScheme='teal'
                variant='solid'
                onClick={onOpen}
            >
                Add
            </Button>}
        </HeaderViewTable>
    )
}

export default HeaderTable