// third-party
import { FormattedMessage } from 'react-intl';


// assets
import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
  LinkOutlined,
  PhoneOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  PlusOutlined,
  LinkOutlined,
  PhoneOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'chat',
      title: <FormattedMessage id="chat" />,
      type: 'item',
      url: '/chat',
      icon: icons.MessageOutlined,
      role: ["mentee", "mentor"]
    },
    {
      id: 'sessions',
      title: <FormattedMessage id="Sessions" />,
      type: 'item',
      icon: icons.PhoneOutlined,
      url: '/sessions',
      role: ["mentee", "mentor"]
    },
    {
      id: 'users',
      title: <FormattedMessage id="Users" />,
      type: 'item',
      icon: icons.CustomerServiceOutlined,
      url: '/users',
      role: ["admin", "account_user"]
    },
    {
      id: 'programs',
      title: <FormattedMessage id="Programs" />,
      type: 'item',
      icon: icons.MessageOutlined,
      url: '/programs',
      role: ["admin", "account_user"]
    },
  ]
};

export default applications;
