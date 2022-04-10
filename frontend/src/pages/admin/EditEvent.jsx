// import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function EditEvent() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const auth = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const { data: { event } } = await axios.get(`${window.server}/event/${id}`);
            setDescription(event.description);
            setName(event.name);
        })()
    }, []);

    function validate() {
        return name !== '' && description !== '';
    }

    const isValid = validate();

    async function submit(e) {
        e.preventDefault();
        if (!isValid) return;
        console.log("Submitted");
        await axios.put(`${window.server}/event/${id}`, { name, description }, { headers: { Authorization: `Bearer ${auth.token}` } })
        navigate('/admin');
    }

    return <div className="container mx-auto px-5 py-12 event-manage">
        <Link to="/admin" className="btn eve-back-btn btn-for-events eve-stake-btn">
            <span className="btn-event btn-visible back-btn stake-btn">
                <span>&larr; &nbsp; Back</span>
            </span>
        </Link>
        <h1 className="text-2xl flex-1 font-bold mb-10 features-head">Edit Event</h1>
        <div className="w-2/3 mx-auto">
            <form onSubmit={submit}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="" style={{ justifyItems: 'center', display: 'flex', flexDirection: 'column', background: 'white', padding: '20px', borderRadius: '20px', marginTop: '30px' }}>
                        <div className="col-span-6 form-group">
                            <label htmlFor="first-name" className="form-label block text-sm font-medium text-gray-700">
                                Event Name
                            </label>
                            <input
                                type="text"
                                name="first-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                id="first-name"
                                required
                                className="form-input mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="col-span-6 form-group">
                            <label htmlFor="first-name" className="form-label block text-sm mb-2 font-medium text-gray-700">
                                Description
                            </label>
                            <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            {/* <RichTextEditor editorState={editorState} setEditorState={setEditorState} /> */}
                        </div>
                        <div className="" style={{ justifyContent: 'center', display: 'flex', background: 'white', padding: '20px', borderRadius: '20px' }}>

                            <button
                                style={{ display: 'inline-block' }}
                                type="submit"
                                disabled={!isValid}
                                className={(isValid ? "" : "pop-btn-disable") + " btn eve-sts-btn create-acc-btn btn-for-events"}
                            >
                                <span className='btn-event cre-acc-btn-txt btn-visible'>

                                    Update
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>;
}

export default EditEvent;
