type BaseErrorDialogProps = {
    error: Error
}
export function BaseErrorDialog({error}:BaseErrorDialogProps){
    return(
        <>
            <p>
                {error.message}
            </p>
            <p>
                {String(error.cause ?? "")}
            </p>
        </>
    )
}