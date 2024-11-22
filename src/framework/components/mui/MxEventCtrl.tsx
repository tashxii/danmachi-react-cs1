import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  CsMutateButtonClickEvent,
  CsQueryButtonClickEvent,
  CsView,
  executeValidation,
} from "../../logics";
import "./MxCtrl.css";
import { Alert, Box, Button, ButtonProps, CircularProgress, Dialog, Tooltip, TooltipProps, Typography } from "@mui/material";

export interface MxEventProps {
  addClassNames?: string[];
}

const getClassName = (props: MxEventProps, base: string): string => {
  let names = [base];
  if (props.addClassNames) {
    names = names.concat(props.addClassNames);
  }
  return names.join(" ");
};

// Promise型かどうかを判定する関数
const isPromise = (obj: any): obj is Promise<any> => {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
};

export interface MxButtonProps extends MxEventProps {
  type?: "text" | "contained" | "outlined" | undefined;
  onClick: (() => boolean) | (() => void);
  validationViews?: CsView[];
  successMessage?: string;
  errorMessage?: string;
  validateErrorMessage?: string;
  disabledReason?: string;
  disabledTooltipProps?: TooltipProps;
  children?: ReactNode | undefined;
  muiProps?: ButtonProps;
  confirmOption?: ConfirmOption;
  onAfterClickSuccess?: () => void | Promise<void>;
  onAfterClickError?: () => void | Promise<void>;
}

export const MxButton = (props: MxButtonProps) => {
  const { onClick, validationViews, muiProps, confirmOption } = props;
  const [showStatus, setShowStatus] = useState<string>();

  const isShowDisableReason = () => {
    const disabledReason =
      props.disabledTooltipProps?.title ?? props.disabledReason;
    return muiProps?.disabled === true && !!disabledReason;
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const handleMouseEnter = () => setShowTooltip(isShowDisableReason());
  const handleMouseLeave = () => setShowTooltip(false);

  const beforeOnClick = useCallback(() => {
    const validationOk = executeValidation(validationViews);
    setShowStatus("");
    if (!validationOk) {
      setShowStatus("validation");
      return false;
    }
    return true;
  }, [setShowStatus, validationViews]);

  const onClickWrap = useCallback(async () => {
    if (onClick() === false) {
      setShowStatus("error");
      if (props.onAfterClickError) {
        const result = props.onAfterClickError();
        if (isPromise(result)) {
          await result;
        }
      }
    } else {
      setShowStatus("success");
      if (props.onAfterClickSuccess) {
        props.onAfterClickSuccess();
        const result = props.onAfterClickSuccess();
        if (isPromise(result)) {
          await result;
        }
      }
    }
  }, [onClick, props]);

  return (
    <div className={getClassName(props, "button-area")}>
      {showStatus === "success" && props.successMessage && (
        <Alert className="mui-button-alert" severity="success" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          {props.successMessage}
        </Alert>
      )}
      {showStatus === "error" && props.errorMessage && (
        <Alert className="mui-button-alert" severity="error" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          {props.errorMessage}
        </Alert>
      )}
      {showStatus === "validation" && props.validateErrorMessage && (
        <Alert className="mui-button-alert" severity="warning" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          {props.validateErrorMessage}
        </Alert>
      )}
      <Tooltip
        placement="top"
        open={showTooltip}
        {...props.disabledTooltipProps}
        title={props.disabledReason}
        arrow
      >
        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MxButtonWithConfrim
            className={getClassName(props, "button")}
            variant={props.type}
            precheckClick={beforeOnClick}
            onButtonClick={() => {
              onClickWrap();
            }}
            confirmOption={confirmOption}
            muiProps={muiProps}
          >
            {props.children}
          </MxButtonWithConfrim>
        </span>
      </Tooltip>
    </div>
  );
};

interface ConfirmOption {
  title: ReactNode;
  content: ReactNode;
  okText: string;
  cancelText?: string;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
}

export interface MxButtonWithConfrimProps {
  className?: string;
  variant?: "text" | "contained" | "outlined" | undefined;
  disabled?: boolean;
  precheckClick?: () => boolean;
  onButtonClick: (() => void) | (() => Promise<void>);
  confirmOption?: ConfirmOption;
  isLoading?: () => boolean;
  children?: ReactNode;
  muiProps?: ButtonProps;
}

export const MxButtonWithConfrim = (props: MxButtonWithConfrimProps) => {
  const { className, variant, precheckClick, onButtonClick, confirmOption, isLoading, muiProps } = props;
  const disabled = muiProps?.disabled ?? props.disabled;
  const [showConfirm, setShowConfirm] = useState(false);
  if (!confirmOption) {
    // 確認オプションが無い場合は、そのままボタンを表示
    return (
      <Button
        className={className}
        variant={variant}
        onClick={async () => {
          if (precheckClick) {
            const precheck = (isPromise(precheckClick)) ? await precheckClick() : precheckClick();
            if (precheck === false) {
              return;
            }
          }
          if (isPromise(onButtonClick)) {
            await onButtonClick();
          } else {
            onButtonClick();
          }
        }}
        disabled={disabled}
        {...muiProps}
      >
        <>
          {isLoading && isLoading() ? <CircularProgress size="sm" /> : null}
          {props.children}
        </>
      </Button>
    )
  }

  return (
    <>
      <Button
        className={className}
        variant={variant}
        onClick={async () => {
          if (precheckClick) {
            const precheck = (isPromise(precheckClick)) ? await precheckClick() : precheckClick();
            if (precheck === false) {
              return;
            }
          }
          setShowConfirm(true);// モーダルの表示
        }}
        disabled={disabled}
        {...muiProps}
      >
        {isLoading && isLoading() ? <CircularProgress size={"sm"} /> : null}
        {props.children}
      </Button>
      <Dialog
        open={showConfirm}
        onClose={() => { setShowConfirm(false); }}
        // aria-labelledby="parent-modal-title"
        // aria-describedby="parent-modal-description"
        maxWidth="sm"
      >
        <Box className="mui-button-confirm-modal">
          <Typography id="modal-modal-title" variant="h6" component="h2" className="mui-button-confirm-modal-title">
            {confirmOption.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} className="mui-button-confirm-modal-content">
            {confirmOption.content}
          </Typography>
          <Box className="mui-button-confirm-modal-footer">
            <Button
              // className="mui-button-confirm-modal-footer-button"
              onClick={() => { setShowConfirm(false); }}
              {...confirmOption.cancelButtonProps}
            >
              {confirmOption.cancelText ?? "キャンセル"}
            </Button>
            <Button
              // className="mui-button-confirm-modal-footer-button"
              onClick={async () => {
                if (isPromise(onButtonClick)) {
                  await onButtonClick();
                } else {
                  onButtonClick();
                }
                setShowConfirm(false);
              }}
              {...confirmOption.okButtonProps}
            >
              <>
                {confirmOption.okText}
              </>
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

export interface MxMutateButtonProps<
  TApiRequest = unknown,
  TApiResponse = unknown,
> extends MxEventProps {
  type?: "text" | "contained" | "outlined" | undefined;
  event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>;
  validationViews?: CsView[];
  successMessage?: string;
  errorMessage?: string;
  validateErrorMessage?: string;
  disabledReason?: string;
  disabledTooltipProps?: TooltipProps;
  children?: ReactNode | undefined;
  muiProps?: ButtonProps;
  confirmOption?: ConfirmOption;
  onBeforeApiCall?:
  | ((event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>) => boolean)
  | ((event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>) => void)
  | ((
    event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>,
  ) => Promise<boolean>)
  | ((
    event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>,
  ) => Promise<void>);
  onAfterApiCallSuccess?:
  | ((event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>) => void)
  | ((
    event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>,
  ) => Promise<void>);
  onAfterApiCallError?:
  | ((event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>) => void)
  | ((
    event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>,
  ) => Promise<void>);
}

export const MxMutateButton = <TApiRequest = unknown, TApiResponse = unknown>(
  props: MxMutateButtonProps<TApiRequest, TApiResponse>,
) => {
  const { event, validationViews, muiProps, confirmOption } = props;
  const [showStatus, setShowStatus] = useState<string>();
  const [clicked, setClicked] = useState(false);

  const isShowDisableReason = () => {
    const disabledReason = props.disabledTooltipProps?.title ?? props.disabledReason;
    return muiProps?.disabled === true && !!disabledReason;
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const handleMouseEnter = () => setShowTooltip(isShowDisableReason());
  const handleMouseLeave = () => setShowTooltip(false);


  useEffect(() => {
    const handleApiCall = async () => {
      if (clicked) {
        if (!event.isLoading) {
          if (event.isSuccess) {
            setShowStatus("success");
            if (props.onAfterApiCallSuccess) {
              const result = props.onAfterApiCallSuccess(event);
              if (isPromise(result)) {
                await result;
              }
            }
            setClicked(false);
          } else if (event.isError) {
            setShowStatus("error");
            if (props.onAfterApiCallError) {
              const result = props.onAfterApiCallError(event);
              if (isPromise(result)) {
                await result;
              }
            }
            setClicked(false);
          }
        }
      }
    };

    handleApiCall();

    // イベント内にはリクエストデータが含まれるため、以下の3つのパラメータだけを依存関係とする
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.isLoading, event.isSuccess, event.isError]);

  const beforeOnClick = useCallback(() => {
    const validationOk = executeValidation(validationViews);
    setShowStatus("");
    if (!validationOk) {
      setShowStatus("validation");
      return false;
    }
    if (event.apiRequest === undefined) {
      setShowStatus("noRequest");
      return false;
    }
    return true;
  }, [event, validationViews]);

  const onClickWrap = useCallback(async () => {
    if (props.onBeforeApiCall) {
      const result = props.onBeforeApiCall(event);
      if (isPromise(result)) {
        const resolve = await result;
        if (resolve === false) {
          return;
        }
      } else if (result === false) {
        return;
      }
    }
    setClicked(true);
    await event.onClick();
  }, [event, props]);

  return (
    <div className={getClassName(props, "button-area")}>
      {showStatus === "success" && props.successMessage && (
        <Alert className="mui-button-alert" severity="success" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          {props.successMessage}
        </Alert>
      )}
      {showStatus === "error" && props.errorMessage && (
        <Alert className="mui-button-alert" severity="error" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          {props.errorMessage}
        </Alert>
      )}
      {showStatus === "validation" && props.validateErrorMessage && (
        <Alert className="mui-button-alert" severity="error" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          {props.validateErrorMessage}
        </Alert>
      )}
      {showStatus === "noRequest" && props.validationViews && (
        <Alert className="mui-button-alert" severity="warning" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          リクエストがありません
        </Alert>
      )}
      <Tooltip
        placement="top"
        open={showTooltip}
        {...props.disabledTooltipProps}
        title={props.disabledReason}
        arrow
      >
        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MxButtonWithConfrim
            className={getClassName(props, "button")}
            variant={props.type}
            precheckClick={beforeOnClick}
            onButtonClick={onClickWrap}
            confirmOption={confirmOption}
            disabled={event.apiRequest === undefined}
            isLoading={() => (event.isLoading)}
            muiProps={muiProps}
          >
            {props.children}
          </MxButtonWithConfrim>
        </span>
      </Tooltip>
    </div >
  );
};
export interface MxQueryButtonProps<TApiResponse = unknown>
  extends MxEventProps {
  type?: "text" | "contained" | "outlined" | undefined;
  event: CsQueryButtonClickEvent<TApiResponse>;
  validationViews?: CsView[];
  successMessage?: string;
  errorMessage?: string;
  validateErrorMessage?: string;
  disabledReason?: string;
  disabledTooltipProps?: TooltipProps;
  children?: ReactNode | undefined;
  muiProps?: ButtonProps;
  confirmOption?: ConfirmOption;
  onBeforeApiCall?:
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => boolean)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => void)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => Promise<boolean>)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => Promise<void>);
  onAfterApiCallSuccess?:
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => void)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => Promise<void>);
  onAfterApiCallError?:
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => void)
  | ((event: CsQueryButtonClickEvent<TApiResponse>) => Promise<void>);
}

export const MxQueryButton = <TApiResponse = unknown,>(
  props: MxQueryButtonProps<TApiResponse>,
) => {
  const { event, validationViews, muiProps, confirmOption } = props;
  const [showStatus, setShowStatus] = useState<string>();
  const [clicked, setClicked] = useState(false);

  const isShowDisableReason = () => {
    const disabledReason = props.disabledTooltipProps?.title ?? props.disabledReason;
    return muiProps?.disabled === true && !!disabledReason;
  };
  const [showTooltip, setShowTooltip] = useState(false);
  const handleMouseEnter = () => setShowTooltip(isShowDisableReason());
  const handleMouseLeave = () => setShowTooltip(false);

  useEffect(() => {
    const handleApiCall = async () => {
      if (clicked) {
        if (!event.isLoading) {
          if (event.isSuccess) {
            setShowStatus("success");
            if (props.onAfterApiCallSuccess) {
              const result = props.onAfterApiCallSuccess(event);
              if (isPromise(result)) {
                await result;
              }
            }
            setClicked(false);
          } else if (event.isError) {
            setShowStatus("error");
            if (props.onAfterApiCallError) {
              const result = props.onAfterApiCallError(event);
              if (isPromise(result)) {
                await result;
              }
            }
            setClicked(false);
          }
        }
      }
    };

    handleApiCall();
    // イベント内には検索条件が含まれるため、以下の3つのパラメータだけを依存関係とする
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.isLoading, event.isSuccess, event.isError]);

  const beforeOnClick = useCallback(() => {
    const validationOk = executeValidation(validationViews);
    setShowStatus("");
    if (!validationOk) {
      setShowStatus("validation");
      return false;
    }
    return true;
  }, [setShowStatus, validationViews]);

  const onClickWrap = useCallback(async () => {
    if (props.onBeforeApiCall) {
      const result = props.onBeforeApiCall(event);
      if (isPromise(result)) {
        const resolve = await result;
        if (resolve === false) {
          return;
        }
      } else if (result === false) {
        return;
      }
    }
    setClicked(true);
    await event.onClick();
  }, [event, props]);

  return (
    <div className={getClassName(props, "button-area")}>
      {showStatus === "success" && props.successMessage && (
        <Alert className="mui-button-alert" severity="success" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          {props.successMessage}
        </Alert>
      )}
      {showStatus === "error" && props.errorMessage && (
        <Alert className="mui-button-alert" severity="error" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          {props.errorMessage}
        </Alert>)}
      {showStatus === "validation" && props.validateErrorMessage && (
        <Alert className="mui-button-alert" severity="error" variant="outlined"
          onClose={() => setShowStatus(undefined)}>
          {props.validateErrorMessage}
        </Alert>
      )}
      <Tooltip
        placement="top"
        open={showTooltip}
        {...props.disabledTooltipProps}
        title={props.disabledReason}
        arrow
      >
        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MxButtonWithConfrim
            className={getClassName(props, "button")}
            variant={props.type}
            precheckClick={beforeOnClick}
            onButtonClick={onClickWrap}
            confirmOption={confirmOption}
            isLoading={() => (event.isLoading)}
            muiProps={muiProps}
          >
            {props.children}
          </MxButtonWithConfrim>
        </span>
      </Tooltip>
    </div>
  );
};