// import { Alert, Button, ButtonProps, Modal, Tooltip, TooltipProps } from "antd";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  CsMutateButtonClickEvent,
  CsQueryButtonClickEvent,
  CsView,
  executeValidation,
} from "../../logics";
import "./BSxCtrl.css";
import { ButtonVariant } from "react-bootstrap/esm/types";
import { Alert, Button, ButtonProps, Modal, OverlayTrigger, Spinner, Tooltip, TooltipProps } from "react-bootstrap";

export interface BSxEventProps {
  addClassNames?: string[];
}

const getClassName = (props: BSxEventProps, base: string): string => {
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

export interface BSxButtonProps extends BSxEventProps {
  type?: ButtonVariant | undefined;
  onClick: (() => boolean) | (() => void);
  validationViews?: CsView[];
  successMessage?: string;
  errorMessage?: string;
  validateErrorMessage?: string;
  disabledReason?: string;
  disabledTooltipProps?: TooltipProps;
  children?: ReactNode | undefined;
  bsProps?: ButtonProps;
  confirmOption?: ConfirmOption;
  onAfterClickSuccess?: () => void | Promise<void>;
  onAfterClickError?: () => void | Promise<void>;
}

export const BSxButton = (props: BSxButtonProps) => {
  const { onClick, validationViews, bsProps, confirmOption } = props;
  const [showStatus, setShowStatus] = useState<string>();

  const isShowDisableReason = () => {
    const disabledReason =
      props.disabledTooltipProps?.title ?? props.disabledReason;
    return bsProps?.disabled === true && !!disabledReason;
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
        <Alert className="button-alert" variant="success" dismissible
          onClose={() => setShowStatus(undefined)}>
          {props.successMessage}
        </Alert>
      )}
      {showStatus === "error" && props.errorMessage && (
        <Alert className="button-alert" variant="danger" dismissible
          onClose={() => setShowStatus(undefined)}>
          {props.errorMessage}
        </Alert>
      )}
      {showStatus === "validation" && props.validateErrorMessage && (
        <Alert className="button-alert" variant="warning" dismissible
          onClose={() => setShowStatus(undefined)}>
          {props.validateErrorMessage}
        </Alert>
      )}
      <OverlayTrigger
        placement="top"
        trigger="hover"
        show={showTooltip}
        overlay={
          <Tooltip
            {...props.disabledTooltipProps}
          >
            {props.disabledReason}
          </Tooltip>
        }
      >
        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <BSxButtonWithConfrim
            className={getClassName(props, "button")}
            variant={props.type}
            precheckClick={beforeOnClick}
            onButtonClick={() => {
              onClickWrap();
            }}
            confirmOption={confirmOption}
            {...bsProps}
          >
            {props.children}
          </BSxButtonWithConfrim>
        </span>
      </OverlayTrigger>
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

export interface BSxButtonWithConfrimProps {
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  precheckClick?: () => boolean;
  onButtonClick: (() => void) | (() => Promise<void>);
  confirmOption?: ConfirmOption;
  isLoading?: () => boolean;
  children?: ReactNode;
  bsProps?: ButtonProps;
}

export const BSxButtonWithConfrim = (props: BSxButtonWithConfrimProps) => {
  const { className, variant, precheckClick, onButtonClick, confirmOption, isLoading, bsProps } = props;
  const disabled = bsProps?.disabled ?? props.disabled;
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
        {...bsProps}
      >
        <>
          {isLoading && isLoading() ? <Spinner size="sm" /> : null}
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
        {...bsProps}
      >
        {isLoading && isLoading() ? <Spinner size="sm" /> : null}
        {props.children}
      </Button>
      <Modal
        size="sm"
        show={showConfirm}
        centered
      >
        <Modal.Header>
          <Modal.Title>
            {confirmOption.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmOption.content}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => { setShowConfirm(false); }}
            {...confirmOption.cancelButtonProps}
          >
            {confirmOption.cancelText ?? "キャンセル"}
          </Button>
          <Button
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
        </Modal.Footer>
      </Modal >
    </>
  );
}

export interface BSxMutateButtonProps<
  TApiRequest = unknown,
  TApiResponse = unknown,
> extends BSxEventProps {
  type?: ButtonVariant | undefined;
  event: CsMutateButtonClickEvent<TApiRequest, TApiResponse>;
  validationViews?: CsView[];
  successMessage?: string;
  errorMessage?: string;
  validateErrorMessage?: string;
  disabledReason?: string;
  disabledTooltipProps?: TooltipProps;
  children?: ReactNode | undefined;
  bsProps?: ButtonProps;
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

export const BSxMutateButton = <TApiRequest = unknown, TApiResponse = unknown>(
  props: BSxMutateButtonProps<TApiRequest, TApiResponse>,
) => {
  const { event, validationViews, bsProps, confirmOption } = props;
  const [showStatus, setShowStatus] = useState<string>();
  const [clicked, setClicked] = useState(false);

  const isShowDisableReason = () => {
    const disabledReason = props.disabledTooltipProps?.title ?? props.disabledReason;
    return bsProps?.disabled === true && !!disabledReason;
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
        <Alert className="button-alert" variant="success" dismissible
          onClose={() => setShowStatus(undefined)}>
          {props.successMessage}
        </Alert>
      )}
      {showStatus === "error" && props.errorMessage && (
        <Alert className="button-alert" variant="danger" dismissible
          onClose={() => setShowStatus(undefined)}>
          {props.errorMessage}
        </Alert>
      )}
      {showStatus === "validation" && props.validateErrorMessage && (
        <Alert className="button-alert" variant="danger" dismissible
          onClose={() => setShowStatus(undefined)}>
          {props.validateErrorMessage}
        </Alert>
      )}
      {showStatus === "noRequest" && props.validationViews && (
        <Alert className="button-alert" variant="warning" dismissible
          onClose={() => setShowStatus(undefined)}>
          リクエストがありません
        </Alert>
      )}
      <OverlayTrigger
        placement="top"
        trigger="hover"
        show={showTooltip}
        overlay={
          <Tooltip
            {...props.disabledTooltipProps}
          >
            {props.disabledReason}
          </Tooltip>
        }
      >
        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <BSxButtonWithConfrim
            className={getClassName(props, "button")}
            variant={props.type}
            precheckClick={beforeOnClick}
            onButtonClick={onClickWrap}
            confirmOption={confirmOption}
            disabled={event.apiRequest === undefined}
            isLoading={() => (event.isLoading)}
            {...bsProps}
          >
            {props.children}
          </BSxButtonWithConfrim>
        </span>
      </OverlayTrigger>
    </div>
  );
};
export interface BSxQueryButtonProps<TApiResponse = unknown>
  extends BSxEventProps {
  type?: ButtonVariant | undefined;
  event: CsQueryButtonClickEvent<TApiResponse>;
  validationViews?: CsView[];
  successMessage?: string;
  errorMessage?: string;
  validateErrorMessage?: string;
  disabledReason?: string;
  disabledTooltipProps?: TooltipProps;
  children?: ReactNode | undefined;
  bsProps?: ButtonProps;
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

export const BSxQueryButton = <TApiResponse = unknown,>(
  props: BSxQueryButtonProps<TApiResponse>,
) => {
  const { event, validationViews, bsProps, confirmOption } = props;
  const [showStatus, setShowStatus] = useState<string>();
  const [clicked, setClicked] = useState(false);

  const isShowDisableReason = () => {
    const disabledReason = props.disabledTooltipProps?.title ?? props.disabledReason;
    return bsProps?.disabled === true && !!disabledReason;
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
        <Alert className="button-alert" variant="success" dismissible
          onClose={() => setShowStatus(undefined)}>
          {props.successMessage}
        </Alert>
      )}
      {showStatus === "error" && props.errorMessage && (
        <Alert className="button-alert" variant="danger" dismissible
          onClose={() => setShowStatus(undefined)}>
          {props.errorMessage}
        </Alert>)}
      {showStatus === "validation" && props.validateErrorMessage && (
        <Alert className="button-alert" variant="danger" dismissible
          onClose={() => setShowStatus(undefined)}>
          {props.validateErrorMessage}
        </Alert>
      )}
      <OverlayTrigger
        placement="top"
        trigger="hover"
        show={showTooltip}
        overlay={
          <Tooltip
            {...props.disabledTooltipProps}
          >
            {props.disabledReason}
          </Tooltip>
        }
      >
        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <BSxButtonWithConfrim
            className={getClassName(props, "button")}
            variant={props.type}
            precheckClick={beforeOnClick}
            onButtonClick={onClickWrap}
            confirmOption={confirmOption}
            isLoading={() => (event.isLoading)}
            {...bsProps}
          >
            {props.children}
          </BSxButtonWithConfrim>
        </span>
      </OverlayTrigger>
    </div>
  );
};