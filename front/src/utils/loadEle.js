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
  FormItem,
  Popover,
  Tabs,
  TabPane,
  Scrollbar,
  Message,
  Timeline,
  TimelineItem,
  RadioGroup,
  RadioButton
} from 'element-ui'
import layout from '@/views/layout/'
Vue.component('layout', layout)
Vue.use(Button)
Vue.use(Select)
Vue.use(Tag)
Vue.use(Card)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Pagination)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Popover)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Scrollbar)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.prototype.$message = Message
