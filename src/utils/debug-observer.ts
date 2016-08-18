
export function createDebugObserver(name) {
    return {
        onNext: value => {
            console.log(`DEBUG >${name}< onNext\n`, value)
        },
        onError: value => {
            console.log(`DEBUG >${name}< onError\n`, value)
        },
        onCompleted: () => {
            console.log(`DEBUG >${name}< onCompleted\n`)
        },
    }
}