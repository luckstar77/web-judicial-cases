import { zodResolver } from '@hookform/resolvers/zod';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { Controller, type FieldErrors, useForm, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { getErrorMessage } from '@/shared/api/api-error';
import { PageContainer } from '@/shared/components/PageContainer';
import { Seo } from '@/shared/components/Seo';
import { buildCaseDetailPath } from '@/shared/constants/routes';
import { getDistricts, TAIWAN_CITIES } from '@/shared/constants/taiwan-districts';
import { useSnackbar } from '@/shared/hooks/snackbar-context';
import { formatRent } from '@/shared/utils/format-number';
import {
  CASE_FORM_DEFAULTS,
  CASE_FORM_STEPS,
  caseCreateSchema,
  type CaseCreateField,
  type CaseCreateFormInput,
  type CaseCreateFormValues,
  toCreateCaseInput,
} from './case-create-schema';
import { CaseGuidelines } from './components/CaseGuidelines';
import { ImageDropzone } from './components/ImageDropzone';
import { CASE_LIMITS, CONTENT_PROMPTS, CONTENT_TEMPLATE } from './constants';
import { useCreateCase } from './hooks';

type CaseForm = UseFormReturn<CaseCreateFormInput, unknown, CaseCreateFormValues>;

const FIRST_STEP = 0;
const CONTENT_MIN_ROWS = 10;

function TargetStep({ form }: { form: CaseForm }) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <Stack spacing={2.5}>
      <Alert severity="info" sx={{ borderRadius: '12px' }}>
        對象資料僅用於比對搜尋，公開顯示時會自動遮罩（例：王*明、09*****678）。
      </Alert>
      <TextField
        label="對象姓名"
        required
        {...register('defendantName')}
        error={Boolean(errors.defendantName)}
        helperText={errors.defendantName?.message ?? '房東或房客的真實姓名'}
        slotProps={{ htmlInput: { maxLength: CASE_LIMITS.defendantNameMax } }}
      />
      <TextField
        label="對象電話（選填）"
        {...register('defendantPhone')}
        error={Boolean(errors.defendantPhone)}
        helperText={errors.defendantPhone?.message ?? '例：0912345678'}
        slotProps={{ htmlInput: { inputMode: 'tel', maxLength: CASE_LIMITS.defendantPhoneMax } }}
      />
      <TextField
        label="對象身分證（選填）"
        {...register('defendantIdNo')}
        error={Boolean(errors.defendantIdNo)}
        helperText={errors.defendantIdNo?.message ?? '可協助其他人精確比對'}
        slotProps={{ htmlInput: { maxLength: CASE_LIMITS.defendantIdNoMax, autoCapitalize: 'characters' } }}
      />
    </Stack>
  );
}

function RentalStep({ form }: { form: CaseForm }) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const city = watch('location');
  const districts = getDistricts(city);
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Controller
          control={control}
          name="location"
          render={({ field }) => (
            <FormControl fullWidth required error={Boolean(errors.location)}>
              <InputLabel id="create-city-label">縣市</InputLabel>
              <Select
                labelId="create-city-label"
                label="縣市"
                {...field}
                onChange={(event) => {
                  field.onChange(event.target.value);
                  setValue('district', '');
                }}
              >
                {TAIWAN_CITIES.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.location?.message ?? ' '}</FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="district"
          render={({ field }) => (
            <FormControl fullWidth required error={Boolean(errors.district)} disabled={!city}>
              <InputLabel id="create-district-label">行政區</InputLabel>
              <Select labelId="create-district-label" label="行政區" {...field}>
                {districts.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.district?.message ?? (city ? ' ' : '請先選擇縣市')}</FormHelperText>
            </FormControl>
          )}
        />
      </Stack>
      <TextField
        label="月租金"
        required
        type="number"
        {...register('rent', { valueAsNumber: true })}
        error={Boolean(errors.rent)}
        helperText={errors.rent?.message ?? '不確定可填 0'}
        slotProps={{
          input: { endAdornment: <InputAdornment position="end">元 / 月</InputAdornment> },
          htmlInput: { min: CASE_LIMITS.rentMin, max: CASE_LIMITS.rentMax, step: 1, inputMode: 'numeric' },
        }}
      />
    </Stack>
  );
}

function StoryStep({ form }: { form: CaseForm }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const content = watch('content');
  const applyTemplate = () => {
    const next = content.trim() ? `${content.trim()}\n\n${CONTENT_TEMPLATE}` : CONTENT_TEMPLATE;
    setValue('content', next, { shouldDirty: true });
  };
  return (
    <Stack spacing={2.5}>
      <TextField
        label="標題"
        required
        placeholder="例：退租後押金遲遲不退，還要求支付不合理清潔費"
        {...register('title')}
        error={Boolean(errors.title)}
        helperText={errors.title?.message ?? `${watch('title').length} / ${CASE_LIMITS.titleMax}`}
        slotProps={{ htmlInput: { maxLength: CASE_LIMITS.titleMax } }}
      />
      <Box>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 1, flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <LightbulbOutlinedIcon fontSize="small" color="secondary" aria-hidden />
            <Typography variant="body2" color="text.secondary">
              依序回答下列問題，讓回報更具參考價值
            </Typography>
          </Stack>
          <Button size="small" startIcon={<AutoFixHighOutlinedIcon />} onClick={applyTemplate}>
            套用撰寫範本
          </Button>
        </Stack>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {CONTENT_PROMPTS.map((prompt, index) => (
            <Chip key={prompt} size="small" label={`${index + 1}. ${prompt}`} variant="outlined" sx={{ backgroundColor: 'background.paper' }} />
          ))}
        </Stack>
        <TextField
          label="事件經過"
          required
          multiline
          minRows={CONTENT_MIN_ROWS}
          placeholder={CONTENT_TEMPLATE}
          {...register('content')}
          error={Boolean(errors.content)}
          helperText={errors.content?.message ?? `${content.length} / ${CASE_LIMITS.contentMax}`}
          slotProps={{ htmlInput: { maxLength: CASE_LIMITS.contentMax } }}
        />
      </Box>
    </Stack>
  );
}

function EvidenceStep({ form }: { form: CaseForm }) {
  const {
    control,
    watch,
    formState: { errors },
  } = form;
  const values = watch();
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle1" component="h3" sx={{ mb: 0.5 }}>
          證據照片（選填）
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          例如租約、對話截圖、匯款紀錄、房屋現況照片。請先遮蔽與事件無關的個資。
        </Typography>
        <Controller
          control={control}
          name="images"
          render={({ field }) => <ImageDropzone value={field.value} onChange={field.onChange} error={errors.images?.message ?? errors.images?.root?.message} />}
        />
      </Box>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', backgroundColor: 'background.default' }}>
        <Typography variant="subtitle2" component="h3" sx={{ mb: 1 }}>
          發布前確認
        </Typography>
        <Box
          component="dl"
          sx={{
            m: 0,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            columnGap: 2,
            rowGap: 0.75,
            '& dt': { color: 'text.secondary' },
            '& dd': { m: 0, overflowWrap: 'anywhere' },
          }}
        >
          <Typography component="dt" variant="body2">
            對象
          </Typography>
          <Typography component="dd" variant="body2">
            {values.defendantName}
          </Typography>
          <Typography component="dt" variant="body2">
            地點
          </Typography>
          <Typography component="dd" variant="body2">
            {[values.location, values.district].filter(Boolean).join(' ')}
          </Typography>
          <Typography component="dt" variant="body2">
            月租
          </Typography>
          <Typography component="dd" variant="body2">
            {Number.isFinite(values.rent) ? formatRent(values.rent) : '未填寫'}
          </Typography>
          <Typography component="dt" variant="body2">
            標題
          </Typography>
          <Typography component="dd" variant="body2">
            {values.title}
          </Typography>
        </Box>
      </Paper>
      <Controller
        control={control}
        name="agreement"
        render={({ field }) => (
          <FormControl error={Boolean(errors.agreement)}>
            <FormControlLabel
              control={<Checkbox checked={field.value} onChange={(event) => field.onChange(event.target.checked)} onBlur={field.onBlur} />}
              label="我確認以上內容屬實，並同意遵守發文規範；如有不實，願自負法律責任。"
            />
            {errors.agreement && <FormHelperText>{errors.agreement.message}</FormHelperText>}
          </FormControl>
        )}
      />
    </Stack>
  );
}

const STEP_COMPONENTS = [TargetStep, RentalStep, StoryStep, EvidenceStep];

const findFirstErrorStep = (errors: FieldErrors<CaseCreateFormInput>): number => {
  const errorFields = Object.keys(errors) as CaseCreateField[];
  const index = CASE_FORM_STEPS.findIndex((step) => step.fields.some((field) => errorFields.includes(field)));
  return index === -1 ? FIRST_STEP : index;
};

function CaseCreateForm() {
  const navigate = useNavigate();
  const { showMessage } = useSnackbar();
  const [activeStep, setActiveStep] = useState(FIRST_STEP);
  const form = useForm<CaseCreateFormInput, unknown, CaseCreateFormValues>({
    resolver: zodResolver(caseCreateSchema),
    defaultValues: CASE_FORM_DEFAULTS,
    mode: 'onTouched',
  });
  const mutation = useCreateCase();
  const isLastStep = activeStep === CASE_FORM_STEPS.length - 1;
  const StepComponent = STEP_COMPONENTS[activeStep];

  const goToStep = (step: number) => {
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = async () => {
    const valid = await form.trigger(CASE_FORM_STEPS[activeStep].fields);
    if (valid) {
      goToStep(activeStep + 1);
    }
  };

  const handleSubmit = form.handleSubmit(
    (values) => {
      mutation.mutate(toCreateCaseInput(values), {
        onSuccess: ({ id }) => {
          showMessage('回報已發布，感謝你的分享！');
          navigate(buildCaseDetailPath(id), { replace: true });
        },
      });
    },
    (errors) => goToStep(findFirstErrorStep(errors)),
  );

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper
          variant="outlined"
          component="form"
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
          sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '16px' }}
        >
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {CASE_FORM_STEPS.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography variant="h4" component="h2" sx={{ mb: 2.5 }}>
            {activeStep + 1}. {CASE_FORM_STEPS[activeStep].label}
          </Typography>
          <StepComponent form={form} />
          {mutation.isError && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {getErrorMessage(mutation.error, '發布失敗，請稍後再試')}
            </Alert>
          )}
          <Stack direction="row" spacing={1.5} sx={{ mt: 4, justifyContent: 'space-between' }}>
            <Button variant="text" color="inherit" disabled={activeStep === FIRST_STEP || mutation.isPending} onClick={() => goToStep(activeStep - 1)}>
              上一步
            </Button>
            {isLastStep ? (
              <Button key="submit" type="submit" variant="contained" color="secondary" size="large" disabled={mutation.isPending} sx={{ minWidth: 140 }}>
                {mutation.isPending ? '發布中…' : '發布回報'}
              </Button>
            ) : (
              <Button key="next" variant="contained" size="large" onClick={() => void handleNext()} sx={{ minWidth: 140 }}>
                下一步
              </Button>
            )}
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: -1, md: 0 } }}>
        <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
          <CaseGuidelines />
        </Box>
      </Grid>
    </Grid>
  );
}

export function CaseCreatePage() {
  return (
    <PageContainer title="我要回報" subtitle="分享你的租屋經驗，幫助下一位房東或房客避開風險。">
      <Seo title="我要回報" description="分享你遇到的租屋糾紛經驗，幫助其他房東與房客在簽約前避開風險。" />
      <RequireAuth reason="登入後即可發布網友回報">
        <CaseCreateForm />
      </RequireAuth>
    </PageContainer>
  );
}
