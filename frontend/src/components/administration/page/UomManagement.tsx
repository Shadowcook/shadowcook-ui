import {useSession} from "../../../contexts/SessionContext.tsx";
import {validateAccess} from "../../../utilities/validate.ts";
import {AccessId} from "@project-types/role/accessId.ts";
import style from "./UomManagement.module.css"
import {useEffect, useState} from "react";
import {Uom} from "@project-types/recipe/uom.ts";
import {fetchAllUom, pushUom} from "@api";
import uomIcon from "@assets/font-awesome/solid/scale-balanced.svg";
import uomIconDeleted from "@assets/font-awesome/solid/ban.svg";
import uomSaveIcon from "@assets/font-awesome/solid/floppy-disk.svg";
import addIcon from "@assets/font-awesome/solid/plus.svg";
import {useMessage} from "@hooks/useMessage.ts";
import {usePageTitle} from "../../../contexts/pageTitleContext.tsx";

export function UomManagement() {
    usePageTitle("Uom Management");
    const session = useSession();
    const {showMessage} = useMessage();
    const [uoms, setUoms] = useState<Uom[]>([]);
    const [selectedUom, setSelectedUom] = useState<Uom | null>(null);

    useEffect(() => {
        if (!validateAccess(session, AccessId.EDIT_UOM)) {
            return;
        }
        fetchAllUom().then((data) => {
            const filtered = data.filter((uom) => uom.id > 0);
            setSortedUoms(filtered);
        });
    }, [session]);

    if (!validateAccess(session, AccessId.EDIT_UOM)) {
        return (<>ACCESS DENIED</>);
    }

    function setSortedUoms(uoms: Uom[]) {
        const sorted = [...uoms].sort((a, b) => {
            if (a.deleted !== b.deleted) {
                return a.deleted ? 1 : -1;
            }
            return a.name.localeCompare(b.name, undefined, {
                sensitivity: "base",
                numeric: true
            });
        });

        setUoms(sorted);
    }

    async function handleSaveUom(uom: Uom) {
        const isNew = uom.id === -1;
        try {
            const res = await pushUom(uom);
            if (res.success) {
                const resUom = res.uoms[0];
                console.log("received UOM result: ", res);
                console.log("received UOM result object: ", resUom);
                if (resUom) {
                    if (isNew) {
                        const updatedUoms = [...uoms, resUom];
                        setSortedUoms(updatedUoms);
                    } else {
                        const updatedUoms: Uom[] = uoms.map((item) =>
                            item.id === uom.id ? uom : item
                        );
                        setSortedUoms(updatedUoms);
                    }
                    showMessage("UOM saved", "success");
                }
            } else {
                console.error("Unable to save UOM:: ", res);
                showMessage("Unable to save UOM. Please check log for details.", "error");
            }
        } catch (e) {
            console.error("Server error while saving UOM: ", e);
            showMessage("Unable to save UOM. Please check log for details.", "error");
        }
    }

    return (
        <div className={style.uomManagementOuter}>
            <div className={style.uomManagementFrame}>
                <div className={style.uomListFrame}>
                    <div key={`uom-list-item-new`} className={style.uomListItem}>
                        <button className={"imageButton"} onClick={() => {
                            const newUom = {
                                id: -1,
                                name: "",
                                deleted: false
                            };
                            setSelectedUom(newUom);
                        }}>
                            <img
                                src={addIcon}
                                alt={"add new UOM"}
                            />
                            New UOM
                        </button>
                    </div>
                    {uoms.map((uom) => (
                        <div key={`uom-list-item-${uom.id}`} className={style.uomListItem}>
                            <button className={"imageButton"} onClick={() => {
                                setSelectedUom(uom);
                            }}>
                                <img
                                    src={uom.deleted ? uomIconDeleted : uomIcon}
                                    alt={!uom.deleted ? "active uom" : "inactive uom"}
                                />
                                {uom.name}
                            </button>
                        </div>
                    ))}
                </div>
                <div className={style.uomOptionsFrame}>
                    {selectedUom ? (
                        <>
                            <h2>{selectedUom.id > 0 ? "Edit UOM" : "New UOM"}</h2>
                            <h3 className={style.uomNameHeadline}>{selectedUom.name.length > 0 ? selectedUom.name : "\u00a0"}</h3>
                            <table className={style.uomDetailsTable}>
                                <tbody>
                                <tr>
                                    <td>Name:</td>
                                    <td>
                                        <input type="text" value={selectedUom.name} onChange={(e) => {
                                            const updatedUom = {
                                                ...selectedUom,
                                                name: e.target.value
                                            };
                                            setSelectedUom(updatedUom);
                                        }}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Deleted:</td>
                                    <td>
                                        <input type="checkbox" checked={selectedUom.deleted} onChange={(e) => {
                                            const updatedUom = {
                                                ...selectedUom,
                                                deleted: e.target.checked
                                            }
                                            setSelectedUom(updatedUom);
                                        }}
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div className={style.saveButtonFrame}>
                                <button className={"imageButton"} onClick={() => {
                                    handleSaveUom(selectedUom);
                                }}>
                                    <img src={uomSaveIcon} alt={"Save"}/>Save
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={style.placeholder}>
                            Please select a unit of measure from the pane on the left.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}