import {Card, CardHeader, CardTitle, CardBody, Form, FormGroup, Label, Input} from 'reactstrap'
import {number, string} from "prop-types"
import {trans} from "@utils"

const RadioGroup = (props) => {
    const {handleChange, checked, name, data} = props
    return (
        <div className='demo-inline-spacing'>
            {data.map((a, index) => <FormGroup key={index} check inline>
                <Label check>
                    <Input checked={checked === a} type='radio' name={name} value={a} onChange={handleChange} /> {trans(`gen.genders.${a}`)}
                </Label>
            </FormGroup>)}

        </div>
    )
}
RadioGroup.prototype = {
    defaultChecked: number,
    name: string
}
export default RadioGroup
