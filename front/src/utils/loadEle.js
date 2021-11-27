import Vue from 'vue'
import {
  Button,
  Select,
  Tag,
  Card,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Input,
  Dialog,
  Form,
  FormItem
} from 'element-ui'
import layout from '@/views/layout/'
Vue.component('layout', layout)
Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
Vue.component(Tag.name, Tag)
Vue.use(Card)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Pagination)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
