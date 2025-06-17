import {useSession} from "../../../session/SessionContext.tsx";
import {validateAccess} from "../../../utilities/validate.ts";
import {AccessId} from "@project-types/role/accessId.ts";
import style from "./UomManagement.module.css"
import {useEffect, useState} from "react";
import {Uom} from "@project-types/recipe/uom.ts";
import {fetchAllUom} from "@api";
import uomIcon from "@assets/font-awesome/solid/scale-balanced.svg";


export function UomManagement() {
    const session = useSession();

    const [uoms, setUoms] = useState<Uom[]>([]);
    const [selectedUom, setSelectedUom] = useState<Uom | null>(null);

    useEffect(() => {
        if (!validateAccess(session, AccessId.EDIT_UOM)) {
            return;
        }
        fetchAllUom().then((data) => {
            const filtered = data.filter((uom) => uom.id > 0);
            setUoms(filtered);
        });
    }, [session]);

    if (!validateAccess(session, AccessId.EDIT_UOM)) {
        return (<>ACCESS DENIED</>);
    }

    return (
        <div className={style.uomManagementFrame}>
            <div className={style.uomListFrame}>
                {uoms.map((uom) => (
                    <button className={uom.deleted ? "imageButtonDisabled" : "imageButton"} onClick={() => {
                        setSelectedUom(uom);
                    }}>
                        <img
                            src={uomIcon}
                            alt={!uom.deleted ? "active uom" : "inactive uom"}
                        />
                        {uom.name}
                    </button>
                ))}
            </div>
            <div className={style.uomOptionsFrame}>
                {selectedUom ? (
                    <>
                        {selectedUom.name}
                    </>
                ) : (
                    <div className={style.placeholder}>
                        Please select a unit of measure from the pane on the left.
                    </div>
                )}
            </div>
        </div>
    );
}