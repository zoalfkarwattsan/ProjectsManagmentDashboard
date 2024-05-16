// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'
import CustomNavbar from './components/navbar'
const VerticalLayout = props => <Layout navbar={<CustomNavbar />} {...props}>{props.children}</Layout>

export default VerticalLayout
