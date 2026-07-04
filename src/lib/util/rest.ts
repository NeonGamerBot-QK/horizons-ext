export interface UserInfoResponse {
    userId: number;
    hcaId: string;
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    slackUserId: string;
    verificationStatus: string;
    role: string;
    onboardComplete: boolean;
    onboardedAt: string;
    hackatimeAccount: string;
    hackatimeStartDate: null;
    referralCode: string;
    referredByUserId: null;
    rafflePos: string;
    createdAt: string;
    updatedAt: string;
    timezone: string;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
    projects: Project[];
    hasAddress: boolean;
    slackDisplayName: string;
}

export interface Project {
    projectId: number;
    userId: number;
    projectType: string;
    createdAt: string;
    updatedAt: string;
    approvedHours: null | number;
    description: string;
    nowHackatimeHours: number;
    nowHackatimeProjects: string[];
    playableUrl: null | string;
    projectTitle: string;
    repoUrl: null | string;
    readmeUrl: null | string;
    journalUrl: null;
    screenshotUrl: null | string;
    isLocked: boolean;
    permReject: boolean;
    deletedAt: null;
    submissions: Submission[];
}

export interface Submission {
    submissionId: number;
    projectId: number;
    playableUrl: string;
    screenshotUrl: string;
    description: string;
    repoUrl: string;
    approvedHours: null | number;
    hackatimeHours: number;
    hoursJustification: null | string;
    approvalStatus: string;
    reviewedAt: null | string;
    claimedById: null;
    claimedAt: null;
    claimHeartbeatAt: null;
    createdAt: string;
    updatedAt: string;
}

export async function getUserInfo(cookie: string): Promise<UserInfoResponse> {
    const response = await fetch('https://horizons.hackclub.com/api/user/auth/me', {
        headers: {
            cookie
        }
    });

    if (!response.ok) {
        throw new Error(`horizons rejected the cookie (status ${response.status})`);
    }

    return response.json();
}