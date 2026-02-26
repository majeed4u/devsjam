import type { GoeyToasterProps } from "goey-toast";
import { GoeyToaster as GoeyToasterPrimitive, goeyToast } from "goey-toast";
import "goey-toast/styles.css";

export { goeyToast };
export type { GoeyToasterProps };
export type {
	GoeyPromiseData,
	GoeyToastAction,
	GoeyToastClassNames,
	GoeyToastOptions,
	GoeyToastTimings,
} from "goey-toast";

function GoeyToaster(props: GoeyToasterProps) {
	return <GoeyToasterPrimitive position="bottom-right" {...props} />;
}

export { GoeyToaster };
