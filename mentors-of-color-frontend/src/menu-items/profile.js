// third-party
import { FormattedMessage } from 'react-intl';


// assets
import {
  UserOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
  AppstoreAddOutlined,
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const profile = {
  id: 'group-profile',
  title: <FormattedMessage id="profile" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      type: 'collapse',
      icon: icons.UserOutlined,
      role: ["admin", "account_user", "mentee", "mentor", "moderator"],
      children: [
        {
          id: 'view-profile',
          title: <FormattedMessage id="view-profile" />,
          type: 'item',
          url: '/profile/view',
          breadcrumbs: false
        },
        {
          id: 'edit-profile',
          title: <FormattedMessage id="edit-profile" />,
          type: 'item',
          url: '/profile/edit/personal',
          breadcrumbs: false
        }
      ]
    }

  ]
};

export default profile;
