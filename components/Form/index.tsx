import React from "react";
import Item from "./Item";
import {
  Form as AntForm,
  FormProps as AntFormProps,
} from "@ant-design/react-native";
import Input from "./Input";
import Switch from "./Switch";

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
    }}
    {...props}
  >
    {children}
  </AntForm>
);

const Form = Object.assign(BaseForm, {
  Item,
  useForm: AntForm.useForm,
  Input: Input,
  Switch: Switch,
});

export default Form;

export { default as Item } from "./Item";
export { default as Input } from "./Input";
export { default as Switch } from "./Switch";
