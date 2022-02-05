export type Boo = (id: string) => string;

// export const makePrintTime = (time: string) : Boo => (id: string) => `${id} / Time: ${time}`

function makePrintTime(time: string) {
  return (id: string) => `${id} / Time: ${time}`;
}

export const getTime = () => new Date().toString();

console.log(makePrintTime(getTime())('20'));
