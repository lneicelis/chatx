
export function createDebugObserver(name) {
    return {
        onNext: value => {
            console.log(`DEBUG >${name}< onNext`, value)
        },
        onError: value => {
            console.log(`DEBUG >${name}< onError`, value)
        },
        onCompleted: () => {
            console.log(`DEBUG >${name}< onCompleted`)
        },
    }
}