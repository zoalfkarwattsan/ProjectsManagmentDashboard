import React from "react"
import {Nav} from 'react-bootstrap'
import {User, Briefcase, Users} from 'react-feather'
import {trans} from '@utils'
import CanCall from "../../../components/CanCall"

const ResponsibleTabs = () => {
	return (
		<div className='profile-tabs d-flex justify-content-between flex-wrap mt-1 mt-md-0'>
			<Nav variant="pills" className="mb-0">

				<CanCall action='TEAMS_VIEW_PROFILE'>
					<Nav.Item>
						<Nav.Link eventKey="profileData">
            <span>
              <User size={18} className='mr-25'/>
            </span>
							<span className='font-weight-bold'>{trans('user.profile.profileDetails')}</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

				<CanCall action='TEAMS_VIEW_PROJECTS'>
					<Nav.Item>
						<Nav.Link eventKey="projects">
          <span>
            <Briefcase size={18} className='mr-25'/>
          </span>
							<span className='font-weight-bold'>{trans('user.profile.projects')}</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

				<CanCall action='TEAMS_VIEW_ELECTIONS'>
					<Nav.Item>
						<Nav.Link disabled eventKey="elections">
          <span>
            <Users size={18} className='mr-25'/>
          </span>
							<span className='font-weight-bold'>{trans('user.profile.elections')}</span>
						</Nav.Link>
					</Nav.Item>
				</CanCall>

			</Nav>
		</div>
	)
}

export default ResponsibleTabs
