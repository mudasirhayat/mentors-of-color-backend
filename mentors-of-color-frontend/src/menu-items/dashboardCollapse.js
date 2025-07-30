import { FormattedMessage } from 'react-intl';
import { DashboardOutlined } from '@ant-design/icons';

const icons = {
  dashboard: DashboardOutlined,
};

const dashboardCollapse = {
  "id": "group-dashboard",
  "title": <FormattedMessage id="dashboard" />,
  "type": "group",
  "children": [
    {
      "id": "dashboard",
      "title": <FormattedMessage id="dashboard" />,
      "type": "collapse",
      "icon": icons.dashboard,
      "children": [
        {
          "id": "default",
          "title": <FormattedMessage id="default" />,
          "type": "item",
          "url": "/dashboard/default",
          "breadcrumbs": false
        },
        {
          "id": "analytics",
          "title": <FormattedMessage id="analytics" />,
          "type": "item",
          "url": "/dashboard/analytics",
          "breadcrumbs": false
        }
      ]
    }
  ]
}

export default dashboardCollapse