import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class HTMLMessage implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /**
     * Empty constructor.
     */
    private _context: ComponentFramework.Context<IInputs>;
    private _messageDiv: HTMLOutputElement;

    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._context = context;
        const messageDiv = document.createElement("div");
        messageDiv.id = "swd_pcf_output";
        //Thank you https://community.dynamics.com/blogs/post/?postid=dbae3ca3-fc59-4235-b38f-d60961f17c70
        //Example https://<YourOrg>.crm6.dynamics.com/api/data/v9.2/contacts?$orderby=modifiedon desc&$top=1
        //This Top1 is important
        if (context.parameters.retrievemultipleentityname.raw === null) {
            messageDiv.innerHTML = `${context.parameters.message.raw}`;
        } else {
            const etn = `${context.parameters.retrievemultipleentityname.raw}`;
            const optsasis = `${context.parameters.retrievemultipleoptions.raw}`;
            const opts = optsasis.includes("$top=1") ? optsasis : optsasis.concat("&$top=1");
            context.webAPI.retrieveMultipleRecords(etn, opts).then(
                function success(result) {
                    // perform operations on on retrieved records
                    console.debug("Retrieved " + result.entities.length + " records");
                    for (let i = 0; i < result.entities.length; i++) {
                        const cn = `${context.parameters.retrievemultiplenamecolumn.raw}`;
                        const id = result.entities[i][`${etn}id`];
                        const nm = result.entities[i][cn];
                        console.debug("details", result.entities[i], cn, id, nm);
                        messageDiv.innerHTML += `<a target='${cn}_${id}'` +
                            ` href='/main.aspx?pagetype=entityrecord&etn=${etn}&id=${id}' ` +
                            ` onclick="context.navigation.openForm({"entityId":"${id}","entityName":"${etn}","openInNewWindow":false});"` +
                            ` >${nm}</a><br/>`;
                        //href='/main.aspx?pagetype=entityrecord&etn=${etn}&id=${id}'
                    }
                },
                function (error) {
                    console.error(error.message);
                    messageDiv.innerHTML = `Error`;
                });
        }
        container.appendChild(messageDiv);
        console.debug("Init done", context);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
