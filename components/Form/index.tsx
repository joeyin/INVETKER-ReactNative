import React from "react";
import Item from "./Item";
import {
  Form as AntForm,
  FormProps as AntFormProps,
} from "@ant-design/react-native";
import Input from "./Input";
import Switch from "./Switch";
import Picker from "./Picker";
import DatePicker from "./DatePicker";

interface FormProps extends AntFormProps {
  children: React.ReactNode;
}

const BaseForm = ({ children, ...props }: FormProps) => (
  <AntForm
    styles={{
      Body: {
        borderTopWidth: 0,
      },
      BodyBottomLine: {
        display: "none",
      },
      ...props.styles,
    }}
    {...props}
  >
    {children}
  </AntForm>
);

const Form = Object.assign(BaseForm, {
  Item,
  useForm: AntForm.useForm,
  Input,
  Switch,
  Picker,
  DatePicker,
});

export default Form;

export { default as Item } from "./Item";
export { default as Input } from "./Input";
export { default as Switch } from "./Switch";
export { default as Picker } from "./Picker";
export { default as DatePicker } from "./DatePicker";
