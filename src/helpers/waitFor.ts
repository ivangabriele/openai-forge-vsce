export async function waitFor(inMs: number): Promise<void> {
  await new Promise(resolve => {
    setTimeout(resolve, inMs)
  })
}
