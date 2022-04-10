import { useContext, useState } from "react";
// import { EditorState, ContentState, convertToRaw } from 'draft-js';
// import RichTextEditor from "../../Components/RichTextEditor";
// import draftToHTML from 'draftjs-to-html';
import axios from "axios";
import { AuthContext } from "../../../context";
import { useNavigate } from "react-router-dom";

function Step2({ eventId }) {
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState([]);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    function validate() {
        return files.length > 0;
    }

    const isValid = validate();

    async function submit(e) {
        e.preventDefault();
        if (!isValid) return;
        const formData = new FormData();
        formData.append("description", description);
        files.forEach(f => {
            formData.append("images", f.file);
        })
        console.log(files.map(f => f.file));
        await axios.post(`${window.server}/event/${eventId}`, formData, { headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'multipart/form-data' } });
        navigate("/admin");
    }

    function addFiles(f) {
        const newfiles = [...files];
        console.log(newfiles)
        for (const file of f.files) {
            newfiles.push({ file, url: URL.createObjectURL(file) });
        }
        f.value = null;
        setFiles(newfiles);
    }

    function removeFile(i) {
        setFiles([...files.slice(0, i), ...files.slice(i + 1)]);
    }

    return <form onSubmit={submit}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div style={{ justifyItems: 'center', display: 'flex', flexDirection: 'column', background: 'white', padding: '20px', borderRadius: '20px', marginTop: '30px' }}>

                <div className="col-span-6 form-group">
                    <label htmlFor="first-name" className="form-label block text-sm mb-2 font-medium text-gray-700">
                        Description
                    </label>
                    <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    {/* <RichTextEditor editorState={editorState} setEditorState={setEditorState} /> */}
                </div>

                <div className="form-group">
                    <label className="form-label">Event Images</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', margin: '10px 0' }}>

                        {files.map((file, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <button onClick={() => removeFile(i)} style={{ position: 'absolute', top: 0, right: 0, color: 'white', background: 'red', borderRadius: '50%', padding: '2px 5px', border: 'none' }}>
                                    x
                                </button>
                                <img src={file.url} style={{ width: '100px' }} alt="uploaded" />
                            </div>
                        ))}
                    </div>
                    <div className="" style={{ padding: '2rem', border: 'dashed 1px gray', borderRadius: '10px', textAlign: 'center' }}>
                        <div>
                            <svg
                                className="mx-auto text-gray-400"
                                style={{ width: '12rem', height: '12rem' }}
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600" style={{ fontSize: '1.4rem', paddingBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                    <span style={{ color: '#5f3dc4' }}>Upload files</span>
                                    <input id="file-upload" name="file-upload" hidden type="file" accept=".jpg,.png" multiple className="sr-only" onChange={(e) => addFiles(e.target)} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
                <div className="" style={{ justifyContent: 'center', display: 'flex', background: 'white', padding: '20px', borderRadius: '20px' }}>
                    <button
                        style={{ display: 'inline-block' }}
                        type="submit"
                        disabled={!isValid}
                        className={(isValid ? "" : "pop-btn-disable") + " btn eve-sts-btn create-acc-btn btn-for-events"}
                    >
                        <span className='btn-event cre-acc-btn-txt btn-visible'>

                            Create
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </form >;
}

export default Step2;