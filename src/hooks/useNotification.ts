import React from "react"
import { useToast } from "@chakra-ui/react"


export const useNotification = () => {

    const toast = useToast({position: 'top-right', isClosable: true})
    const toastIdRef = React.useRef<string | number | undefined>()

    function closeToast() {
        if (toastIdRef.current) {
          toast.close(toastIdRef.current)
        }
    }

    function openToast(status:TToastStatus, description: string, title:string) {
        toastIdRef.current = toast({  
            title,
            description,
            status,
        })
    }

   return {
    closeToast,
    openToast,
   }

}