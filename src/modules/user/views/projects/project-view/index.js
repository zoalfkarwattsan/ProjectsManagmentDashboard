import React, {Fragment, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Badge, Button, Card, CardBody, CardHeader, Col, Label, Progress, Row, Table} from "reactstrap"
import {Link, useParams} from "react-router-dom"
import {Briefcase, CheckCircle, CheckSquare, FileText, Hash, Trash2, XCircle} from "react-feather"
import _ from "lodash"

// import StatsVertical from '@components/widgets/stats/StatsVertical'
import {trans, _url} from '@utils'
import AvatarGroup from '@components/avatar-group'

import {_getProjectInfo} from "../../../redux/actions"
import TasksList from "../tasks-list"
import ProjectTracker from "./ProjectTracker"
import ProjectStatistics from "./PojectStatistics"
import CompletedStatsOverview from "./CompletedStatsOverview"

const ProjectView = props => {
    const [projectData, setProjectData] = useState(null)
    const {id} = useParams()

    const _getProjectData = () => {
        _getProjectInfo(id, (data) => setProjectData(data))
    }

    useEffect(() => {
        _getProjectData()
        const myInterval = setInterval(
            _getProjectData, 30000)
        return () => {
            clearInterval(myInterval)
        }
    }, [])

    return (
        <Fragment>
            {projectData &&
                <>
                    <Row className={'match-height'}>
                        {/*<Col md={3} sm='6' xs='12'>*/}
                        {/*	<StatsVertical icon={<CheckSquare size={21} />} color='secondary' stats={`${_.size(projectData.tasks)}`} statTitle={trans('user.total#OfTasks')} />*/}
                        {/*</Col>*/}
                        {/*<Col md={3} sm='6' xs='12'>*/}
                        {/*	<StatsVertical icon={<CheckSquare size={21} />} color='success' stats={`${_.size(_.filter(projectData.tasks, x => x.status_id === 2))}`} statTitle={trans('user.completedTasks')} />*/}
                        {/*</Col>*/}
                        {/*<Col md={3} sm='6' xs='12'>*/}
                        {/*	<StatsVertical icon={<CheckSquare size={21} />} color='info' stats={`${_.size(_.filter(projectData.tasks, x => x.status_id === 3))}`} statTitle={trans('user.onGoingTasks')} />*/}
                        {/*</Col>*/}
                        {/*<Col md={3} sm='6' xs='12'>*/}
                        {/*	<StatsVertical icon={<CheckSquare size={21} />} color='warning' stats={`${_.size(_.filter(projectData.tasks, x => x.status_id === 1))}`} statTitle={trans('user.pendingTasks')} />*/}
                        {/*</Col>*/}
                        {/*<Col>*/}
                        {/*	<ProjectTracker projectData={projectData} />*/}
                        {/*</Col>*/}
                        <Col md={8} xs={12}>
                            <ProjectStatistics projectData={projectData}/>
                        </Col>
                        <Col md={4} xs={12}>
                            <CompletedStatsOverview projectData={projectData}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col>
                                            <h4>{projectData.name}</h4>
                                            <span>{projectData.description}</span>
                                        </Col>
                                    </Row>
                                    <Button.Ripple color='info' className='btn-icon btn-sm mr-1' onClick={() => {
                                    }}>
                                        <FileText size={14}/>
                                    </Button.Ripple>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <p>{trans('user.citizen')}</p>
                                            {projectData.user &&
                                                <Link to={`/citizens/${_.get(projectData, 'user.id')}`}
                                                      className='w-100'>
                                                    <Badge pill
                                                           color='light-secondary'>{_.get(projectData, 'user.fname')} {_.get(projectData, 'user.mname')} {_.get(projectData, 'user.lname')}</Badge>
                                                </Link>
                                            }
                                        </Col>
                                        <Col>
                                            <p>{trans('user.startDate')}</p>
                                            <Badge
                                                color='light-info'>{new Date(projectData.start_date).toLocaleDateString()}</Badge>
                                        </Col>
                                        <Col>
                                            <p>{trans('user.dueDate')}</p>
                                            <Badge
                                                color='light-danger'>{new Date(projectData.due_date).toLocaleDateString()}</Badge>
                                        </Col>
                                        <Col>
                                            <p>{trans('user.projectManagers')}</p>
                                            <AvatarGroup data={_.map(projectData.responsibles, (x) => {
                                                return {
                                                    title: `${x.fname.replaceAll('.', '')} ${x.mname.replaceAll('.', '')} ${x.lname.replaceAll('.', '')}`,
                                                    img: _url(x.image)
                                                }
                                            })}/>
                                        </Col>
                                        <Col>
                                            <p>{trans('user.createdAt')}</p>
                                            <Badge
                                                color='light-info'>{new Date(projectData.created_at).toLocaleDateString()}</Badge>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    <Row>
                                        <Col>
                                            <p>{trans('user.progress')}</p>
                                            <div className={'w-100'}>
                                                <span>{`${Math.floor(_.size(projectData.tasks) > 0 ? _.size(_.filter(projectData.tasks, x => x.status_id === 1)) === 0 ? 100 : (_.size(_.filter(projectData.tasks, x => x.status_id === 2)) / _.size(_.filter(projectData.tasks, x => x.status_id === 1 || x.status_id === 2))) * 100 : 0)}%`}</span>
                                                <Progress
                                                    value={`${Math.floor(_.size(projectData.tasks) > 0 ? _.size(_.filter(projectData.tasks, x => x.status_id === 1)) === 0 ? 100 : (_.size(_.filter(projectData.tasks, x => x.status_id === 2)) / _.size(_.filter(projectData.tasks, x => x.status_id === 1 || x.status_id === 2))) * 100 : 0)}`}/>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TasksList onSuccessCallback={_getProjectData} projectId={id}/>
                        </Col>
                    </Row>
                </>
            }
        </Fragment>
    )
}

ProjectView.propTypes = {}

export default ProjectView
