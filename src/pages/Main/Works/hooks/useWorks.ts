import React from "react"


export const useWorks = () => {
    
    const [isLoading, setIsLoading] = React.useState(false)
    const [data, setData] = React.useState<TWork[]>([])



    const handleViewDetails = (item: TWork) => {

    }
    const handleEdit = async (item: TWork) => {

    }

    const handleDelete = (item: TWork) => {

    }

    return {
        isLoading,
        data,
        handleViewDetails,
        handleEdit,
        handleDelete,
    }
}