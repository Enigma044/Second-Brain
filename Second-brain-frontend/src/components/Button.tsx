import { type ReactElement } from "react"

type Variants="primary"|"secondary"
export interface ButtonProps{
variant:Variants,
size:"sm"|"md"|"lg",
text:string,
startIcon?:ReactElement,
endIcon?:ReactElement,
onClick:()=>void
}
const variantStyle={
    "primary":"bg-purple-600 text-white",
    "secondary":"bg-purple-300 text-purple-600"
}
export const Button=(props:ButtonProps)=>{
return <button></button>
}
<Button variant="primary" size="md"  onClick={()=>{}} text={"asd"}   ></Button>