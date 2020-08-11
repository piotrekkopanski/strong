import React from 'react';
import { config } from '../_constants';
import { authHeader } from '../_helpers';
import Modal from 'react-bootstrap/Modal'
 
export default class TrainingPlanPage extends React.Component {
  constructor() {
    super();
    this.state = {
    	show: true,
    	training_plan: {}
    };
  }

  loadData = () => {
  	var id = this.props.match.params.id
	  const requestOptions = {
	    method: 'GET',
	    headers:  authHeader()
    };
    return fetch(`${config.apiUrl}/api/v1/training_plans/${id}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        this.setState({
          training_plan: data
        })
      })
      .catch(err => console.error(this.props.url, err.toString()))
  }

  componentDidMount() {
    this.loadData()
  }

   setShow(show) {
    this.setState({show: show});
  }

  render() {
    return (
    	<div>
    	  <Modal
          show={this.state.show}
          onHide={() => this.setShow(false)}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              <strong>Nazwa:</strong>{this.state.training_plan.name} <strong>Cel:</strong>{this.state.training_plan.goal}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="container-fluid">
          	{this.state.training_plan.sessions? this.state.training_plan.sessions.map((session, index) => (
                <div>
               <div className="session_name"><strong>Name:</strong> { session.name }</div>
                {session.training_positions? session.training_positions.map((position, index) => (
          		<div className={'row position_box ' + position.type}>
          		  <div className="show-position col-2 exercise">
                <label className="show-position exercise font-courier"><strong>Ćwiczenie</strong></label>
                <div className="show_position_exercise">{position.exercise}</div>
              </div>
              <div className={"show-position col-4"  + (position.position_type == '3' ? ' hide' : '')}>
                <label className="show-position font-courier"><strong>L. powtórzeń</strong></label>
                <ul className="horizontally">
	                {position.number_of_repetitions.map((number_of_repetitions, i)=> (
	                	<li className="horizontally" key={i}>x<strong>{number_of_repetitions}</strong> </li>
	                	))}
                </ul>
                	
              </div>
               <div className="show-position col-4">
                <label className="show-position font-courier"><strong>Przerwa</strong></label>
                <ul className="horizontally">
                 {position.break_after.map((break_after, i)=> (
                	<li className="horizontally time" key={i}>{break_after} </li>
                	))}
                </ul>
              </div>
              <div className={"show-position col-4" + (position.position_type != '3' ? ' hide' : '')}>
                <label className="show-position font-courier"><strong>Czas trwania</strong></label>
                 <ul className="horizontally">
                 {position.duration.map((duration, i)=> (
                	<li className="horizontally time" key={i}>{duration} </li>
                	))}
                	</ul>
              </div>
               <div className="show-position col-2">
                <label className="show-position font-courier"><strong>Typ</strong></label>
                <div className="show_position_type">{position.type}</div> { position.type == 'cardio' ? <i class="fas fa-2x fa-heartbeat"></i> : ''}
              </div>
             </div>
          		)) : ''}
          		</div>
              
          		)) : ''}
          </div>
          </Modal.Body>
        </Modal>
    	</div>
    )
  }
}
