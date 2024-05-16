import React from "react"
import {Nav} from 'react-bootstrap'
import {User, Briefcase, Users} from 'react-feather'
import {trans} from '@utils'
import {CanCall} from "@modules/user"

const ElectionTabs = () => {
	return (
		<div className='d-flex justify-content-between flex-wrap mt-1 mt-md-0'>
			<Nav variant="pills" className="mb-0">

				<CanCall action='ELECTIONS_VIEW_CITIZENS'>
					<Nav.Item>
						<Nav.Link eventKey="citizens">
            {/*<span>*/}
            {/*  <User size={18} className='mr-25'/>*/}
            {/*</span>*/}
							<span className='font-weight-bold'>{trans('user.nav.citizens')}</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

				<CanCall action='ELECTIONS_VIEW_BOXES'>
					<Nav.Item>
						<Nav.Link eventKey="boxes">
            {/*<span>*/}
            {/*  <User size={18} className='mr-25'/>*/}
            {/*</span>*/}
							<span className='font-weight-bold'>{trans('user.boxes')}</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

				<CanCall action='ELECTIONS_VIEW_PARTIES'>
					<Nav.Item>
						<Nav.Link eventKey="parties">
            {/*<span>*/}
            {/*  <User size={18} className='mr-25'/>*/}
            {/*</span>*/}
							<span className='font-weight-bold'>{trans('user.parties')}</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

				<CanCall action='ELECTIONS_VIEW_CLOSEREQUESTS'>
					<Nav.Item>
						<Nav.Link eventKey="closeRequests">
            {/*<span>*/}
            {/*  <User size={18} className='mr-25'/>*/}
            {/*</span>*/}
							<span className='font-weight-bold'>{trans('user.closeRequests')}</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

			</Nav>
		</div>
	)
}

export default ElectionTabs
